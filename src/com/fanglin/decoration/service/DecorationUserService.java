package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.vo.Authentication;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationUserVO;
import com.fanglin.utils.Paging;

public interface DecorationUserService {
	
	public List<DecorationUserVO> queryDecorationUser(Paging paging, List<Filter> filters,DecorationUserVO decorationUserVO);
	
	public int addDecorationUser(DecorationUserVO decorationUserVO,Authentication authentication);
	
	public int deleteDecorationUser(DecorationUserVO decorationUserVO);
}
