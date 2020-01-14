package com.fanglin.production.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.production.service.TranpackService;
import com.fanglin.production.vo.TranpackVO;


@ParentPackage("base")
@Namespace("/")
@Controller
public class TranpackAction extends BaseListAction{

	private static final long serialVersionUID = -3102399576757116170L;

	private TranpackVO tranpack;
	
	private List<TranpackVO> tranpacks;
	
	@Autowired
	private TranpackService tranpackService;
	
	@Action(value = "pageTranpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String pageTranpack () throws FLException{
		
		tranpackService.pageTranpack(getPaging(), getFilters());
		
		return  SUCCESS;
	}

	@Action(value = "queryTranpackByPid", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String queryTranpackByPid () throws FLException{
		
		tranpacks = tranpackService.queryTranpackByPid(tranpack);
		
		return  SUCCESS;
	}
	
	@Action(value = "packTranpackForOutsource", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String packTranpackForOutsource () throws FLException{
		
		tranpackService.packTranpackForOutsource(tranpack,queryUserId());
		
		return  SUCCESS;
	}
	
	@Action(value = "packTranpackForHardware", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String packTranpackForHardware () throws FLException{
		
		tranpackService.packTranpackForHardware(tranpack,queryUserId());
		
		return  SUCCESS;
	}
	
	@Action(value = "packTranpackForPlan", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String packTranpackForPlan () throws FLException{
		
		tranpackService.packTranpackForPlan(tranpack,queryUserId());
		
		return  SUCCESS;
	}
	
	@Action(value = "instoreTranpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String instoreTranpack () throws FLException{
		
		tranpackService.instoreTranpack(tranpack);
		
		return  SUCCESS;
	}
	
	@Action(value = "planTranPack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String planTranPack () throws FLException{
		
		tranpackService.planTranPack(tranpack);
		
		return  SUCCESS;
	}
	
	@Action(value = "tranTranpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String tranTranpack () throws FLException{
		
		tranpackService.tranTranpack(tranpack,queryUserId());
		
		return  SUCCESS;
	}
	
	@Action(value = "mountTranpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String mountTranpack () throws FLException{
		
		tranpackService.mountTranpack(tranpack,queryUserId());
		
		return  SUCCESS;
	}
	
	@Action(value = "completeTranpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String completeTranpack () throws FLException{
		
		tranpackService.completeTranpack(tranpack);
		
		return  SUCCESS;
	}
	
	@Action(value = "lossTranpack", results = { @Result(name = "success", type = "json", params = { "ignoreHierarchy", "false" }) }, params = { "contentType", "text/html" })
	public  String lossTranpack () throws FLException{
		
		tranpackService.lossTranpack(tranpack);
		
		return  SUCCESS;
	}
	
	public TranpackVO getTranpack() {
		return tranpack;
	}

	public void setTranpack(TranpackVO tranpack) {
		this.tranpack = tranpack;
	}

	public List<TranpackVO> getTranpacks() {
		return tranpacks;
	}

	public void setTranpacks(List<TranpackVO> tranpacks) {
		this.tranpacks = tranpacks;
	}
	
}
