/**
 * @File Name		: OrderDesignPictureAction
 * @Package   	: com.fanglin.action.orderDesignPicture
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.service.DecorationPictureService;
import com.fanglin.decoration.vo.DecorationPictureVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DecorationPictureAction extends BaseListAction {

	private static final long serialVersionUID = -1599812124963548192L;

	@Autowired
	private DecorationPictureService decorationPictureService;

	private DecorationPictureVO decorationPicture;

	private List<DecorationPictureVO> decorationPictures;

	@Action(value = "queryDecorationPictureByOrderId", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryDecorationPictureByOrderId() {

		decorationPictures = decorationPictureService.queryDecorationPictureByOrderId(decorationPicture);

		return SUCCESS;
	}

	@Action(value = "addDecorationPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addDecorationPicture() throws FLException {

		decorationPictureService.addDecorationPicture(decorationPicture, queryUserId(), queryCompany());

		return SUCCESS;
	}

	@Action(value = "deleteDecorationPicture", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteDecorationPicture() {

		decorationPictureService.deleteDecorationPicture(decorationPicture);

		return SUCCESS;
	}

	public DecorationPictureVO getDecorationPicture() {
		return decorationPicture;
	}

	public void setDecorationPicture(DecorationPictureVO decorationPicture) {
		this.decorationPicture = decorationPicture;
	}

	public List<DecorationPictureVO> getDecorationPictures() {
		return decorationPictures;
	}

	public void setDecorationPictures(List<DecorationPictureVO> decorationPictures) {
		this.decorationPictures = decorationPictures;
	}

}
