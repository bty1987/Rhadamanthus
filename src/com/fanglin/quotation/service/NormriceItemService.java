package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.quotation.vo.NormriceItemVO;
import com.fanglin.quotation.vo.NormtionVO;

public interface NormriceItemService {

	public List<NormriceItemVO> queryNormriceItem(NormriceItemVO normriceItems);

	public List<NormriceItemVO> queryNormriceItemByType(NormriceItemVO normriceItems);

	public int addNormriceItem(NormtionVO normtionVO, NormriceItemVO normriceItemsVO) throws FLException;

	public int deleteNormriceItem(NormtionVO normtionVO, NormriceItemVO normriceItemsVO) throws FLException;

	public int confirmNormriceItem(NormriceItemVO normriceItemVO) throws FLException;

	public int rejectNormriceItem(NormriceItemVO normriceItemVO) throws FLException;
}
