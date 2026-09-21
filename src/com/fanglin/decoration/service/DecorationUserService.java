package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationUserVO;
import com.fanglin.utils.Paging;

public interface DecorationUserService {

	public void pageDecorationForUser(Paging paging, List<Filter> filters, String userId) throws FLException;

	public List<DecorationUserVO> queryDecorationUser(Paging paging, List<Filter> filters, DecorationUserVO decorationUserVO);

	public int addDecorationUser(DecorationUserVO decorationUserVO, String userId) throws FLException;

	public int updateDecorationUser(DecorationUserVO decorationUserVO) throws FLException;

	public int deleteDecorationUser(DecorationUserVO decorationUserVO) throws FLException;

}
