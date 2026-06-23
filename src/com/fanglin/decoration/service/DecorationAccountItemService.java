package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationAccountItemVO;

public interface DecorationAccountItemService {

	public List<DecorationAccountItemVO> queryDecorationAccountItem(DecorationAccountItemVO decorationAccountItemVO);

	public void updateDecorationAccountItem(DecorationAccountItemVO decorationAccountItemVO, List<DecorationAccountItemVO> decorationAccountItems) throws FLException;

}
