
package com.fanglin.decoration.service;

import com.fanglin.decoration.po.DecorationInfoPO;

public interface DecorationInfoService {
	
	public DecorationInfoPO queryDecorationInfoByOrderId(String orderId);
}
