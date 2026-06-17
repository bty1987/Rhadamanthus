package com.fanglin.common.action;

import java.io.File;
import java.io.FileInputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.apache.struts2.interceptor.ServletRequestAware;
import org.apache.struts2.interceptor.ServletResponseAware;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.aliyun.oss.OSS;
import com.aliyun.oss.OSSClientBuilder;
import com.fanglin.aliyun.config.OssProperties;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.UUIDUtil;
import com.opensymphony.xwork2.ActionSupport;

@ParentPackage("login")
@Namespace("/")
@Controller
public class UploadAction extends ActionSupport implements ServletRequestAware, ServletResponseAware {

	private static final long serialVersionUID = -8920466592471253212L;

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	private OssProperties ossProperties;

	protected HttpServletRequest request;

	protected HttpServletResponse response;

	private File file;

	private File strutsUploads;

	private String strutsUploadsFileName = "";

	private String resUrl;

	private Integer errorCode;

	private String errorMsg;

	/**
	 * 服务端上传文件到 OSS（兜底通道）
	 *
	 * 密钥来源从 {@link OssProperties}（加密配置文件）读取，不再硬编码。
	 * 适用于无法浏览器直传的场景（钉钉微应用、后端生成文件等）。
	 */
	@Action(value = "uploadFile", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String uploadFile() throws Exception {

		File _file = file == null ? strutsUploads : file;

		if (_file == null) {
			throw new FLException(110014, "无效文件");
		}

		if (_file.length() > ossProperties.getMaxFileSize()) {
			throw new FLException(110016, "文件大小超出");
		}

		// 后缀名白名单校验
		String suffix = strutsUploadsFileName.substring(strutsUploadsFileName.lastIndexOf(".") + 1).toLowerCase();
		if (!isAllowedExt(suffix)) {
			throw new FLException(110015, "不支持的文件类型");
		}

		// 日期分目录 + UUID 防冲突
		String fileName = String.format("%s/%s.%s", new SimpleDateFormat("yyyy/MM/dd").format(new Date()), UUIDUtil.getUuid(), suffix);

		OSS ossClient = null;
		InputStream inputStream = null;

		try {
			ossClient = new OSSClientBuilder().build(ossProperties.getEndpoint(), ossProperties.getAccessKeyId(), ossProperties.getAccessKeySecret());
			inputStream = new FileInputStream(_file.getPath());
			ossClient.putObject(ossProperties.getBucket(), fileName, inputStream);

			resUrl = String.format("https://%s.%s/%s", ossProperties.getBucket(), ossProperties.getEndpoint(), fileName);
			errorCode = 0;
		} catch (Exception e) {
			logger.error("OSS 上传失败 [bucket={}, fileName={}]", ossProperties.getBucket(), fileName, e);
			throw new FLException(110017, "文件上传失败");
		} finally {
			if (inputStream != null) {
				try {
					inputStream.close();
				} catch (Exception ie) {
					logger.warn("关闭输入流异常", ie);
				}
			}
			if (ossClient != null) {
				ossClient.shutdown();
			}
		}

		return SUCCESS;
	}

	/**
	 * 校验文件后缀是否在白名单内
	 */
	private boolean isAllowedExt(String suffix) {
		if (suffix == null || suffix.isEmpty()) {
			return false;
		}
		Set<String> allowed = new HashSet<String>(Arrays.asList(ossProperties.getAllowedExts().toLowerCase().split(",")));
		return allowed.contains(suffix);
	}

	@Override
	public void setServletResponse(HttpServletResponse response) {
		this.response = response;
	}

	@Override
	public void setServletRequest(HttpServletRequest request) {
		this.request = request;
	}

	public File getFile() {
		return file;
	}

	public void setFile(File file) {
		this.file = file;
	}

	public String getStrutsUploadsFileName() {
		return strutsUploadsFileName;
	}

	public void setStrutsUploadsFileName(String strutsUploadsFileName) {
		this.strutsUploadsFileName = strutsUploadsFileName;
	}

	public File getStrutsUploads() {
		return strutsUploads;
	}

	public void setStrutsUploads(File strutsUploads) {
		this.strutsUploads = strutsUploads;
	}

	public String getResUrl() {
		return resUrl;
	}

	public void setResUrl(String resUrl) {
		this.resUrl = resUrl;
	}

	public Integer getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(Integer errorCode) {
		this.errorCode = errorCode;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}

	public String uploadFileError() throws Exception {
		return SUCCESS;
	}

}
