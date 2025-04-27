package com.fanglin.data.material.action;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.material.service.GoodsRecordService;
import com.fanglin.data.material.vo.GoodsRecordVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class GoodsRecordAction extends BaseListAction {

	private static final long serialVersionUID = -8328729945059874759L;

	@Autowired
	private GoodsRecordService goodsRecordService;

	private GoodsRecordVO goodsRecord;

	@Action(value = "pageGoodsRecord", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageGoodsRecord() throws FLException {

		goodsRecordService.pageGoodsRecord(getPaging(), getFilters(), goodsRecord);

		return SUCCESS;
	}

	public GoodsRecordVO getGoodsRecord() {
		return goodsRecord;
	}

	public void setGoodsRecord(GoodsRecordVO goodsRecord) {
		this.goodsRecord = goodsRecord;
	}

}
