package com.fanglin.data.common.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.service.GoodsKindService;
import com.fanglin.data.common.vo.GoodsKindVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class GoodsKindAction extends BaseListAction {

	private static final long serialVersionUID = -1338033211897302063L;

	@Autowired
	private GoodsKindService goodsKindService;

	private List<GoodsKindVO> goodsKinds;

	private GoodsKindVO goodsKind;

	@Action(value = "pageGoodsKind", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String pageGoodsKind() throws FLException {

		goodsKindService.pageGoodsKind(getPaging(), getFilters());

		return SUCCESS;
	}

	@Action(value = "queryGoodsKind", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsKind() throws FLException {

		goodsKinds = goodsKindService.queryGoodsKind();

		return SUCCESS;
	}

	@Action(value = "queryGoodsKindByFgkid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsKindByFgkid() throws FLException {

		goodsKinds = goodsKindService.queryGoodsKindByFgkid(goodsKind);

		return SUCCESS;
	}
	
	@Action(value = "queryGoodsKindByGkid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryGoodsKindByGkid() throws FLException {

		goodsKind = goodsKindService.queryGoodsKindByGkid(goodsKind);

		return SUCCESS;
	}

	@Action(value = "addGoodsKind", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addGoodsKind() throws FLException {

		goodsKindService.addGoodsKind(goodsKind, queryCompany());

		return SUCCESS;
	}

	@Action(value = "updateGoodsKind", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateGoodsKind() throws FLException {

		goodsKindService.updateGoodsKind(goodsKind);

		return SUCCESS;
	}

	@Action(value = "updateGoodsKindForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateGoodsKindForStatus() throws FLException {

		goodsKindService.updateGoodsKindForStatus(goodsKind);

		return SUCCESS;
	}

	public List<GoodsKindVO> getGoodsKinds() {
		return goodsKinds;
	}

	public void setGoodsKinds(List<GoodsKindVO> goodsKinds) {
		this.goodsKinds = goodsKinds;
	}

	public GoodsKindVO getGoodsKind() {
		return goodsKind;
	}

	public void setGoodsKind(GoodsKindVO goodsKind) {
		this.goodsKind = goodsKind;
	}

}
