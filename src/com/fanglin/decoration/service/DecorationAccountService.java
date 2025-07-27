package com.fanglin.decoration.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationAccountVO;
import com.fanglin.decoration.vo.DecorationVO;

public interface DecorationAccountService {

	public DecorationAccountVO queryDecorationAccount(DecorationAccountVO decorationAccountVO);

	public void updateDecorationAccount(DecorationAccountVO decorationAccountVO) throws FLException;

	public void makeDecorationAccount(DecorationAccountVO decorationAccountVO, String userId) throws FLException;

	public void sendDecorationAccount(DecorationAccountVO decorationAccountVO) throws FLException;

	public int affirmDecorationAccount(DecorationVO decorationVO, DecorationAccountVO decorationAccountVO, String securityCode, String verifyCode) throws FLException;

}
