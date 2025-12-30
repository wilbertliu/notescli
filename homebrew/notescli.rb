class Notescli < Formula
  desc "Create and Read Apple Notes via CLI"
  homepage "https://github.com/wilbertliu/notescli"
  version "0.1.1"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/wilbertliu/notescli/releases/download/v#{version}/notescli-#{version}-darwin-arm64.tar.gz"
      sha256 "144b4f212cb452ee0e46c8e756d62c7a7300d1b8cca0ad3906cf5924eb95d151"
    else
      url "https://github.com/wilbertliu/notescli/releases/download/v#{version}/notescli-#{version}-darwin-x64.tar.gz"
      sha256 "c456ba18d196fd4c61eb39e892cdfb024b5dd5157a661942e3125988993cf3ea"
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
