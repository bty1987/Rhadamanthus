package com.fanglin.decoration.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationAccountVO;

public interface DecorationAccountService {
	
	public DecorationAccountVO queryDecorationAccount(DecorationAccountVO decorationAccountVO);
	
	public void makeDecorationAccount(DecorationAccountVO decorationAccountVO) throws FLException;
	
}
