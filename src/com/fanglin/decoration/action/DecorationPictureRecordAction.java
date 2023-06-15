package com.fanglin.decoration.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationPictureRecordService;
import com.fanglin.decoration.vo.DecorationPictureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationPictureRecordAction extends BaseListAction {

	private static final long serialVersionUID = -7050040608538831421L;

	@Autowired
	private DecorationPictureRecordService decorationPictureRecordService;

	private DecorationPictureVO decorationPicture;

	private String path;

	@Action(value = "downloadDecorationPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String downloadDecorationPicture() throws FLException {

		path = decorationPictureRecordService.downloadDecorationPicture(decorationPicture, queryUserId());

		return SUCCESS;
	}

	public DecorationPictureVO getDecorationPicture() {
		return decorationPicture;
	}

	public void setDecorationPicture(DecorationPictureVO decorationPicture) {
		this.decorationPicture = decorationPicture;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

}
