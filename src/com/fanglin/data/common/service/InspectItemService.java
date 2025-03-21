package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.InspectItemVO;

public interface InspectItemService {

	public List<InspectItemVO> queryInspectItem(InspectItemVO inspectItemVO);

	public void addInspectItem(InspectItemVO inspectItemVO);

	public void updateInspectItem(InspectItemVO inspectItemVO) throws FLException;

	public void deleteInspectItem(InspectItemVO inspectItemVO) throws FLException;

}
