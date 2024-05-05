package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.AssistanceVO;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

public interface AssistanceService {

	public void pageAssistance(Paging paging, List<Filter> filters);

	public List<AssistanceVO> queryAssistance(AssistanceVO assistanceVO);

	public AssistanceVO queryAssistanceByAid(AssistanceVO assistanceVO);

	public AssistanceVO queryAssistanceByKeyword(AssistanceVO assistanceVO);

	public int addAssistance(AssistanceVO assistance, String queryUserId);

	public int updateAssistance(AssistanceVO assistance);

	public int updateAssistanceForStatus(AssistanceVO assistance);

}
