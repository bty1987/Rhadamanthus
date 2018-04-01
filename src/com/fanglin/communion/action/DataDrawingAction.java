package com.fanglin.communion.action;

import java.util.List;

import org.apache.struts2.convention.annotation.Action;
import org.apache.struts2.convention.annotation.Namespace;
import org.apache.struts2.convention.annotation.ParentPackage;
import org.apache.struts2.convention.annotation.Result;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import com.fanglin.communion.service.DataDrawingService;
import com.fanglin.communion.vo.DataDrawingVO;
import com.fanglin.core.action.BaseListAction;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.utils.SystemConfig;

@ParentPackage("base")
@Namespace("/")
@Controller
public class DataDrawingAction extends BaseListAction {

	private static final long serialVersionUID = -4317018401125519869L;

	@Autowired
	private DataDrawingService dataDrawingService;
	
	private DataDrawingVO dataDrawing;
	
	private List<DataDrawingVO> dataDrawings;
	
	@Action(value="queryDataDrawing", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String queryDataDrawing() throws FLException{
		
		dataDrawings = dataDrawingService.queryDataDrawing(dataDrawing);
		
		return SUCCESS;
	}

	@Action(value="addDataDrawing", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String addDataDrawing() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		dataDrawingService.addDataDrawing(dataDrawing, queryUserId());
		
		return SUCCESS;
	}
	
	@Action(value="deleteDataDrawing", results={ @Result(name="success", type="json", params={"ignoreHierarchy", "false"})}, params={"contentType", "text/html"})
	public String deleteDataDrawing() throws FLException{
		
		if(SystemConfig.getString("communion") == null){
		    throw new FLException(-1, "无操作权限");
		}
		
		dataDrawingService.deleteDataDrawing(dataDrawing);
		
		return SUCCESS;
	}

	public DataDrawingVO getDataDrawing() {
		return dataDrawing;
	}

	public void setDataDrawing(DataDrawingVO dataDrawing) {
		this.dataDrawing = dataDrawing;
	}

	public List<DataDrawingVO> getDataDrawings() {
		return dataDrawings;
	}

	public void setDataDrawings(List<DataDrawingVO> dataDrawings) {
		this.dataDrawings = dataDrawings;
	}
	
}
