/**
 * @File Name		: WeChatUserBindDaoImpl.java
 * @Package   	: com.fanglin.wechat.dao.impl
 * @Version		: 1.0
 * @Date			: 2018-5-1
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 微信用户绑定 DAO 实现类
 */

package com.fanglin.wechat.dao.impl;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.wechat.dao.WeChatUserBindDao;
import com.fanglin.wechat.po.WeChatUserBindPO;

/**
 * 微信用户绑定 DAO 实现
 */
@Repository("weChatUserBindDao")
public class WeChatUserBindDaoImpl extends DaoImpl<WeChatUserBindPO> implements WeChatUserBindDao {

	public WeChatUserBindDaoImpl() {
		super(WeChatUserBindPO.class);
	}

	@Override
	public WeChatUserBindPO queryUserBind(String unionId) {
		return (WeChatUserBindPO) session()
				.createCriteria(WeChatUserBindPO.class)
				.add(Restrictions.eq(WeChatUserBindPO.COLUMN_UNIONID_STR, unionId))
				.uniqueResult();
	}

	@Override
	public void deleteUserBind(Long userId) {
		String sql = "delete from wechat.user_bind where userId = :userId";
		session().createSQLQuery(sql).setLong("userId", userId).executeUpdate();
	}

}
