/**
 * @File Name		: OtherPayableBillService.java
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
import java.util.List;

import com.fanglin.kingdee.ko.OtherPayableBillItemKO;

public interface OtherPayableBillService extends Serializable {

	public void save(String collectTime, String orderId, String grade, List<OtherPayableBillItemKO> items) throws Exception;

}
