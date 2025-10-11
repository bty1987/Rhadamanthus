/**
 * @File Name		: FunctionAreaServiceImpl.java
 * @Package   	: com.fanglin.service.impl
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service.impl;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fanglin.data.quotation.service.FunctionAreaOtemService;
import com.fanglin.data.quotation.vo.FunctionAreaOtemVO;

@Service("functionAreaOtemService")
@Transactional(readOnly = true)
public class FunctionAreaOtemServiceImpl implements FunctionAreaOtemService {

	@Override
	public FunctionAreaOtemVO queryFunctionAreaOtem(FunctionAreaOtemVO functionAreaOtem) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public FunctionAreaOtemVO makeFunctionAreaOtem(FunctionAreaOtemVO functionAreaOtem) {
		// TODO Auto-generated method stub
		return null;
	}

}
