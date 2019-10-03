package config

var GitRevision string
var BuildTime string

type BuildInfo struct {
	Version string `json:"version"`
}

func GetBuildInfo() BuildInfo {
	return BuildInfo{Version: GitRevision + " / " + BuildTime}
}
