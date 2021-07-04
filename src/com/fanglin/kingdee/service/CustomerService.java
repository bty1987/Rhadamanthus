/**
 * @File Name		: CustomerService.java
 * @Package   	: com.fanglin.kingdee.service
 * @Version		: 1.0
 * @Date			: 2021-6-30
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.kingdee.service;

import java.io.Serializable;

import com.fanglin.decoration.po.DecorationPO;

public interface CustomerService extends Serializable {

	public void save(DecorationPO decorationPO) throws Exception;

}
