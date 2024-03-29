{ pkgs }:

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
    nodejs-18_x
    nodePackages.pnpm

    # testing
    cypress
    xorg.xorgserver

    # go development
    go
    go-outline
    gopls
    gopkgs
    go-tools
    delve

    postgresql
  ];

  hardeningDisable = [ "all" ];

  FONTCONFIG_PATH = fontConfigEtc;
  CYPRESS_RUN_BINARY= "${pkgs.cypress}/bin/Cypress";
  GO_TAGS = "postgres";

  shellHook = ''
    PATH=$PWD/node_modules/.bin:$PATH
  '';
}
