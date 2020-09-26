package com.fanglin.store.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.store.service.MorderItemService;
import com.fanglin.store.vo.MorderItemVO;
import com.fanglin.store.vo.MorderVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class MorderItemAction extends BaseListAction {

	private static final long serialVersionUID = -4587634162177356129L;

	@Autowired
	private MorderItemService morderItemService;

	private MorderVO morder;

	private List<MorderItemVO> morderItems;

	@Action(value = "queryMorderItemByOid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryMorderItemByOid() {

		morderItems = morderItemService.queryMorderItemByOid(morder);

		return SUCCESS;
	}

	public MorderVO getMorder() {
		return morder;
	}

	public void setMorder(MorderVO morder) {
		this.morder = morder;
	}

	public List<MorderItemVO> getMorderItems() {
		return morderItems;
	}

	public void setMorderItems(List<MorderItemVO> morderItems) {
		this.morderItems = morderItems;
	}

}
