{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-21.11.tar.gz") { } }:

pkgs.mkShell {
  # nativeBuildInputs is usually what you want -- tools you need to run
  nativeBuildInputs = with pkgs; [
    nixpkgs-fmt
    rnix-lsp
    docker-client
    gnumake

    # nodejs
    nodejs-17_x
  ];

  hardeningDisable = [ "all" ];

  shellHook = ''
    PATH=$PWD/node_modules/.bin:$PATH
  '';
}
