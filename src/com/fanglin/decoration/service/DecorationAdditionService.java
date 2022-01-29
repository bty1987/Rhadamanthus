package com.fanglin.decoration.service;

import java.util.List;
import java.util.Map;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.po.DecorationPO;
import com.fanglin.decoration.vo.DecorationAdditionVO;
import com.fanglin.decoration.vo.DecorationVO;

public interface DecorationAdditionService {

	public DecorationAdditionVO queryDecorationAdditionByOrderId(DecorationAdditionVO decorationAdditionVO);

	public Map<String, Object> queryDecorationConfig(List<Short> typeness, int company);

	public short queryDecorationSchedule(DecorationVO decorationVO) throws FLException;

	public void updateDecorationForPayScale(DecorationPO decorationPO) throws FLException;

	public void updateDecorationForSaleScale(DecorationPO decorationPO) throws FLException;
}
