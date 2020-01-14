/**
 * @File Name		: DecorationMidpackService.java
 * @Package   	: com.fanglin.decoration.service
 * @Version		: 1.0
 * @Date			: 2019-11-15
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationMidpackVO;

public interface DecorationMidpackService {

	public int makeDecorationMidpack(DecorationMidpackVO decorationMidpackVO, String userId) throws FLException;

}
