/**
 * @File Name		: WJsapiTicketDao.java
 * @Package   	: com.fanglin.common.dao
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.wechat.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.wechat.po.JsapiTicketPO;

public interface JsapiTicketDao extends Dao<JsapiTicketPO> {

	public JsapiTicketPO queryJsapiTicket(int company);

	public int deleteJsapiTicket(long operateTime);

}
