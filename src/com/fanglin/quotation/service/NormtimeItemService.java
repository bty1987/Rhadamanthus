package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.NormtimeItemVO;
import com.fanglin.quotation.vo.NormtionVO;

public interface NormtimeItemService {

	public List<NormtimeItemVO> queryNormtimeItem(NormtimeItemVO normtimeItems);

	public int addNormtimeItem(NormtionVO normtionVO, NormtimeItemVO normtimeItemsVO) throws FLException;

	public int deleteNormtimeItem(NormtionVO normtionVO, NormtimeItemVO normtimeItemsVO) throws FLException;
}
