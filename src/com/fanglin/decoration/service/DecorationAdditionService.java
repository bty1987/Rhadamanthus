package com.fanglin.decoration.service;

import java.util.Map;

import com.fanglin.decoration.vo.DecorationAdditionVO;

public interface DecorationAdditionService {
	
	public DecorationAdditionVO queryDecorationAdditionByOrderId(DecorationAdditionVO decorationAdditionVO);
	
	public Map<String, Object> queryDecorationConfig(int company);
}
