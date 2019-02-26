package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.information.vo.AwardRecordVO;
import com.fanglin.utils.Paging;

public interface AwardRecordService {
	
	public void pageAwardRecord(Paging paging, List<Filter> filters, Authentication authentication, AwardRecordVO awardRecordVO, int company);
	
}
