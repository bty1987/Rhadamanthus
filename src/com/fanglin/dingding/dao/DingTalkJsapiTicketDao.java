/**
 * @File Name		: DJsapiTicketDao.java
 * @Package   	: com.fanglin.common.dao
 * @Version		: 1.0
 * @Date			: 2016-5-2
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	:
 */

package com.fanglin.dingding.dao;

import com.fanglin.core.dao.Dao;
import com.fanglin.dingding.po.DingTalkJsapiTicketPO;

public interface DingTalkJsapiTicketDao extends Dao<DingTalkJsapiTicketPO> {

	public DingTalkJsapiTicketPO queryJsapiTicket(int company);

	public int deleteJsapiTicket(long operateTime);

}
