package com.fanglin.market.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.market.po.CnoticePO;
import com.fanglin.market.service.CnoticeService;
import com.fanglin.market.vo.CnoticeVO;

@ParentPackage("base")
@Namespace("/")
@Controller
public class EnoticeAction extends BaseListAction {

	private static final long serialVersionUID = -9079978792019970634L;

	@Autowired
	private CnoticeService cnoticeService;

	private List<CnoticeVO> cnotices;

	private CnoticeVO cnotice;

	private int count;

	private String unionId;

	@Action(value = "queryCnoticeBySender", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCnoticeBySender() throws FLException {

		cnotices = cnoticeService.queryCnoticeByUid(cnotice, CnoticePO.TYPE_SENDER_INT);

		return SUCCESS;
	}

	@Action(value = "queryCnoticeByReceiver", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String queryCnoticeByReceiver() throws FLException {

		cnotices = cnoticeService.queryCnoticeByUid(cnotice, CnoticePO.TYPE_RECEIVER_INT);

		return SUCCESS;
	}

	@Action(value = "countCnoticeByReceiver", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String countCnoticeByReceiver() throws FLException {

		count = cnoticeService.countCnotice(cnotice, CnoticePO.TYPE_RECEIVER_INT);

		return SUCCESS;
	}

	@Action(value = "addCnotice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String addCnotice() throws FLException {

		cnoticeService.addCnotice(cnotice, unionId);

		return SUCCESS;
	}

	@Action(value = "deleteCnotice", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String deleteCnotice() throws FLException {

		cnoticeService.deleteCnotice(cnotice);

		return SUCCESS;
	}

	@Action(value = "updateCnoticeForStatus", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public String updateCnoticeForStatus() throws FLException {

		cnoticeService.updateCnoticeForStatus(cnotice);

		return SUCCESS;
	}

	public List<CnoticeVO> getCnotices() {
		return cnotices;
	}

	public void setCnotices(List<CnoticeVO> cnotices) {
		this.cnotices = cnotices;
	}

	public CnoticeVO getCnotice() {
		return cnotice;
	}

	public void setCnotice(CnoticeVO cnotice) {
		this.cnotice = cnotice;
	}

	public int getCount() {
		return count;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public String getUnionId() {
		return unionId;
	}

	public void setUnionId(String unionId) {
		this.unionId = unionId;
	}

}
