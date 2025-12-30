class Notescli < Formula
  desc "Create and Read Apple Notes via CLI"
  homepage "https://github.com/wilbertliu/notescli"
  version "0.1.0"

  on_macos do
    if Hardware::CPU.arm?
      url "https://github.com/wilbertliu/notescli/releases/download/v#{version}/notescli-#{version}-darwin-arm64.tar.gz"
      sha256 "e57c201a390d8e2439bdce08592b3b014b65b5d406df872bb4e84ce6d7c3bce0"
    else
      url "https://github.com/wilbertliu/notescli/releases/download/v#{version}/notescli-#{version}-darwin-x64.tar.gz"
      sha256 "844891991380cd82d31085917f8f1446661730ee2807a83d29cf10a264811dde"
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
