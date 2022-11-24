{
  description = "pdf-clipper app";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-22.05";
  inputs.flake-utils.url = "github:numtide/flake-utils";

  outputs = { self, flake-utils, nixpkgs }:
    flake-utils.lib.eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};
    in rec {
      packages.default = devShells.default;

      devShells.default = pkgs.callPackage ./shell.nix {};
    });
}
