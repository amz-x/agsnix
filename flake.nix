{

  description = "AGSNIX - Angular, SASS, GraphQL, Next.js, & Nix";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    devenv.url = "github:cachix/devenv";
  };

  outputs = { self, nixpkgs, devenv, ... } @ inputs:
    let
      systems = [ "x86_64-linux" "x86_64-darwin" "aarch64-linux" "aarch64-darwin" ];
      forAllSystems = f: builtins.listToAttrs (map (name: { inherit name; value = f name; }) systems);
    in
    {
      devShells = forAllSystems (system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          bashPkg = pkgs.bashInteractive;
          nodejsPkg = pkgs.nodejs_20;
          pnpmPkg = pkgs.nodePackages.pnpm.override { nodejs = nodejsPkg; };
        in
        {
          default = devenv.lib.mkShell {
            inherit inputs pkgs;
            modules = [
              {

                # Languages
                # https://devenv.sh/reference/options
                languages = {

                  # Languages - JavaScript - Enable
                  # https://devenv.sh/reference/options/#languagesjavascriptenable
                  javascript.enable = true;

                  # Languages - JavaScript - Package
                  # https://devenv.sh/reference/options/#languagesjavascriptpackage
                  javascript.package = nodejsPkg;

                  # Languages - TypeScript - Enable
                  # https://devenv.sh/reference/options/#languagestypescriptenable
                  typescript.enable = true;
                };

                # Packages
                # https://devenv.sh/reference/options/#packages
                # https://search.nixos.org/packages?channel=unstable
                packages = [
                  # Bash
                  bashPkg
                  # NodeJS
                  nodejsPkg
                  # PNPM
                  pnpmPkg
                ];

                enterShell = ''
                  echo "###############################################################"
                  echo "Project:            AGSNIX v0.1                                "
                  echo "Bash:               ${bashPkg.name}                            "
                  echo "NodeJS:             ${nodejsPkg.name}                          "
                  echo "PNPM:               ${pnpmPkg.name}                            "
                  echo "###############################################################"
                '';
              }
            ];
          };
        }
      );
    };
}
