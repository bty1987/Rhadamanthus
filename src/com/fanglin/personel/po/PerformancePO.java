package com.fanglin.personel.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "performance", catalog = "communion")
public class PerformancePO implements Serializable {

	private static final long serialVersionUID = -8979328875291176003L;

	public static final short TYPE_TASK_INT = 0; // 任务

	public static final short TYPE_CODE_INT = 1; // 代码

	public static final short TYPE_FILE_INT = 2; // 文档

	public static final short TYPE_TEST_INT = 3; // 测试用例

	public static final short TYPE_BUG_INT = 4; // bug

	public static final short TYPE_DELAY_INT = 5; // 延期

	public static final short TYPE_ERROR_INT = 6; // 失误

	public static final short TYPE_ATTENDANCE_INT = 7; // 考勤

	public static final short TYPE_OVERTIME_INT = 8; // 加班

	public static final short LEVEL_LOW_INT = 0; // 低级

	public static final short LEVEL_IN_INT = 1; // 中级

	public static final short LEVEL_HIGH_INT = 2; // 高级

	private long pid;

	private UserPO user;

	private short type;

	private long value;

	private short level;

	private Timestamp startTime;

	private Timestamp endTime;

	private String work;

	private String content;

	public PerformancePO() {
		super();
	}

	public PerformancePO(UserPO user) {
		super();
		this.user = user;
	}

	@Id
	@GeneratedValue
	@Column(name = "pid")
	public long getPid() {
		return pid;
	}

	public void setPid(long pid) {
		this.pid = pid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "type")
	public short getType() {
		return type;
	}

	public void setType(short type) {
		this.type = type;
	}

	@Column(name = "value")
	public long getValue() {
		return value;
	}

	public void setValue(long value) {
		this.value = value;
	}

	@Column(name = "level")
	public short getLevel() {
		return level;
	}

	public void setLevel(short level) {
		this.level = level;
	}

	@Column(name = "startTime")
	public Timestamp getStartTime() {
		return startTime;
	}

	public void setStartTime(Timestamp startTime) {
		this.startTime = startTime;
	}

	@Column(name = "endTime")
	public Timestamp getEndTime() {
		return endTime;
	}

	public void setEndTime(Timestamp endTime) {
		this.endTime = endTime;
	}

	@Column(name = "work")
	public String getWork() {
		return work;
	}

	public void setWork(String work) {
		this.work = work;
	}

	@Column(name = "content")
	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

}
