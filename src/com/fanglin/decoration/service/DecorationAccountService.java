package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.vo.DecorationAccountVO;
import com.fanglin.decoration.vo.DecorationVO;
import com.fanglin.utils.Paging;

public interface DecorationAccountService {

	public void pageDecorationAccount(Paging paging, List<Filter> filters, int company) throws FLException;

	public DecorationAccountVO queryDecorationAccount(DecorationAccountVO decorationAccountVO);

	public void updateDecorationAccount(DecorationAccountVO decorationAccountVO) throws FLException;

	public void makeDecorationAccount(DecorationAccountVO decorationAccountVO, String userId) throws FLException;

	public void sendDecorationAccount(DecorationAccountVO decorationAccountVO, String userId) throws FLException;

	public int affirmDecorationAccount(DecorationVO decorationVO, DecorationAccountVO decorationAccountVO, String securityCode, String verifyCode, String phoneCode, String company) throws FLException;

}
