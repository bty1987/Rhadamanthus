package com.fanglin.store.service;
import java.util.List;

import com.fanglin.core.vo.Filter;
import com.fanglin.store.vo.EvaluateVO;
import com.fanglin.utils.Paging;

public interface EvaluateService {
	
	public void pageEvaluate (Paging paging, List<Filter> filters);

	public void addEvaluate (List<EvaluateVO> evaluates);
	
}
