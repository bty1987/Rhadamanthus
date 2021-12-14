package com.fanglin.customer.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.customer.vo.EmemberVO;
import com.fanglin.utils.Paging;

public interface EmemberService {

	public void pageEmember(Paging paging, List<Filter> filters);

	public EmemberVO queryEmember(EmemberVO ememberVO);

	public int addEmember(EmemberVO ememberVO, String securityCode, String verifyCode) throws FLException;

	public void deleteEmember(EmemberVO emember) throws FLException;
}
