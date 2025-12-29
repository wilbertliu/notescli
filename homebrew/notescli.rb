class Notescli < Formula
  desc "Create Apple Notes from Markdown via CLI (macOS)"
  homepage "https://github.com/<owner>/notescli"
  version "0.1.0"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/<owner>/notescli/releases/download/v#{version}/notescli-#{version}-darwin-arm64.tar.gz"
      sha256 "7f7b6469c956280aa7c405d9e64fa7d7052b1408b1afa78f5748c18b49d85870"
    else
      url "https://github.com/<owner>/notescli/releases/download/v#{version}/notescli-#{version}-darwin-x64.tar.gz"
      sha256 "d74f7efdab8e107ef6623df1531f12f09f664b92be13852351784edf25006ae6"
    end
  end

  def install
    bin.install "notescli"
  end

  test do
    output = shell_output("#{bin}/notescli create --dry-run --text '# Hi' --json")
    assert_match "\"dryRun\": true", output
  end

  def caveats
    <<~EOS
      On first run, macOS may prompt you to allow automation control:
        System Settings → Privacy & Security → Automation → allow your terminal to control “Notes”.
    EOS
  end
end
