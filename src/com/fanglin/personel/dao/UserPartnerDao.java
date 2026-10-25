package com.fanglin.personel.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.personel.po.UserPartnerPO;

public interface UserPartnerDao extends Dao<UserPartnerPO> {

	public List<UserPartnerPO> queryUserPartner(int uid);

	public UserPartnerPO queryUserPartner(int uid, short type, int company);

	public List<UserPartnerPO> queryUserPartnerByUid(int uid, short type, int company);

	public UserPartnerPO queryUserPartnerByPuid(int puid, short type, int company);
}
