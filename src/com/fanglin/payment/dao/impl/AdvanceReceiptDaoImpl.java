/**
 * @File Name		: AdvanceReceiptDaoImpl.java
 * @Package   	: com.fanglin.finance.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-11-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.payment.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.payment.dao.AdvanceReceiptDao;
import com.fanglin.payment.po.AdvanceReceiptPO;

@Repository("advanceReceiptDao")
public class AdvanceReceiptDaoImpl extends DaoImpl<AdvanceReceiptPO> implements AdvanceReceiptDao {

}
