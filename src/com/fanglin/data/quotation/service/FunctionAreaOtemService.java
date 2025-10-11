/**
 * @File Name		: QuotationItemService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.service;

import com.fanglin.data.quotation.vo.FunctionAreaOtemVO;

public interface FunctionAreaOtemService {

	public FunctionAreaOtemVO queryFunctionAreaOtem(FunctionAreaOtemVO functionAreaOtem);

	public FunctionAreaOtemVO makeFunctionAreaOtem(FunctionAreaOtemVO functionAreaOtem);

}
