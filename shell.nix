{ pkgs ? import (fetchTarball "https://github.com/NixOS/nixpkgs/archive/nixos-21.11.tar.gz") { } }:

let
  fontConfigEtc = (
    pkgs.nixos { config.fonts.fontconfig.enable = true; }
  ).config.environment.etc.fonts.source;

in pkgs.mkShell {
  # nativeBuildInputs is usually what you want -- tools you need to run
  nativeBuildInputs = with pkgs; [
    nixpkgs-fmt
    rnix-lsp
    docker-client
    gnumake

    # nodejs
    nodejs-17_x

    cypress
    xorg.xorgserver
  ];

  hardeningDisable = [ "all" ];

  FONTCONFIG_PATH = fontConfigEtc;
  CYPRESS_RUN_BINARY= "${pkgs.cypress}/bin/Cypress";

  shellHook = ''
    PATH=$PWD/node_modules/.bin:$PATH
  '';
}
