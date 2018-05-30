package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.LabelVO;
import com.fanglin.utils.Paging;

public interface LabelService {

	public List<LabelVO> querylabel(LabelVO labelVO);
	
	public void pageLabel(Paging paging, List<Filter> filters);
	
	public void updataForStatus(LabelVO labelVO);
	
	public void addLabel(LabelVO labelVO);
	
	public List<LabelVO> querylabelBytype(LabelVO labelVO);
	
}
