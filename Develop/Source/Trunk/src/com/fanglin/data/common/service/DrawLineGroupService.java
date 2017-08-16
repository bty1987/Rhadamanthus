package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.DrawLineGroupVO;
import com.fanglin.utils.Paging;

public interface DrawLineGroupService  {

	public List<DrawLineGroupVO> pageDrawLineGroup(Paging paging, List<Filter> filters, int conmpany);
	
	public  List<DrawLineGroupVO>  queryDrawLineGroup(int company);
	
	public  void  saveDrawLineGroup(DrawLineGroupVO drawLineGroupVO, int company) throws FLException;
	
	public  void  updateDrawLineGroup(DrawLineGroupVO drawLineGroupVO) throws FLException;
	
	public  void  updateDrawLineGroupForStatus(DrawLineGroupVO drawLineGroupVO)throws FLException;
	
}
