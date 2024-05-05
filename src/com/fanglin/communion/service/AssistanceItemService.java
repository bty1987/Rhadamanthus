package com.fanglin.communion.service;

import java.util.List;

import com.fanglin.communion.vo.AssistanceItemVO;
import com.fanglin.communion.vo.AssistanceVO;

public interface AssistanceItemService {

	public List<AssistanceItemVO> queryAssistanceItem(AssistanceVO assistance);

	public int addAssistanceItem(AssistanceVO assistance, AssistanceItemVO assistanceItem);

	public int updateAssistanceItem(AssistanceVO assistance, AssistanceItemVO assistanceItem);

}
