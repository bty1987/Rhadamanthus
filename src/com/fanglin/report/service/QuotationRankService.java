/**
 * @File Name		: DecorationRankService.java
 * @Package   	: com.fanglin.report.service
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */
package com.fanglin.report.service;

import java.util.List;

import com.fanglin.report.vo.AddReduceRankVO;

public interface QuotationRankService {

	public List<AddReduceRankVO> rankAddReduce(int company);

}
