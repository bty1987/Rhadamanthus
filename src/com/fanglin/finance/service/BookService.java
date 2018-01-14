/**
 * @File Name		: BookService.java
 * @Package   	: com.fanglin.finance.service
 * @Version		: 1.0
 * @Date			: 2016-4-17
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.finance.service;

import com.fanglin.core.interceptor.FLException;

public interface BookService {
	
	public int initBook(String period) throws FLException;
	
	public int checkoutBook() throws FLException;
	
	public int openBook(String period) throws FLException;
	
	public int closeBook(String period) throws FLException;

}
