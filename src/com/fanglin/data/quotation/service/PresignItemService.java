package com.fanglin.data.quotation.service;

import java.text.ParseException;
import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.quotation.vo.PresignItemVO;
import com.fanglin.utils.Paging;

public interface PresignItemService {

	public void pagePresignItem(Paging paging, List<Filter> filters, PresignItemVO presignItemVO, List<Short> types);

	public PresignItemVO queryPresignItemByPiid(PresignItemVO presignItem) throws FLException;

	public int addPresignItem(PresignItemVO presignItem);

	public int updatePresignItem(PresignItemVO presignItem) throws FLException, ParseException;

	public int updatePresignItemForStatus(PresignItemVO presignItem) throws FLException;

	public int deletePresignItem(PresignItemVO presignItem);

}
