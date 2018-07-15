package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.common.vo.LabelVO;
import com.fanglin.utils.Paging;

public interface LabelService {
	
	public void pageLabel(Paging paging, List<Filter> filters);

	public List<LabelVO> queryLabel(LabelVO labelVO);
	
	public void addLabel(LabelVO labelVO);
	
	public void updateLabel(LabelVO labelVO) throws FLException;
	
	public void updateLabelForStatus(LabelVO labelVO) throws FLException;
	
}
