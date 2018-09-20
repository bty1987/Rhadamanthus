/**
 * @File Name		: CountingService.java
 * @Package   	: com.fanglin.service
 * @Version		: 1.0
 * @Date			: 2015-1-26
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.common.service;

public interface CountingService {
	
	public int queryCountingByTypeDate(int type, String date, int company);

	public void updateCountingByTypeDate(int type, String date, int company, int count);

}
