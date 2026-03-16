from app.core.events import InMemoryDomainEventPublisher


class DummySession:
    def __init__(self) -> None:
        self.info = {}


def test_event_publisher_stages_envelopes() -> None:
    publisher = InMemoryDomainEventPublisher(DummySession())

    publisher.stage(
        event_name="shell.test",
        payload={"ok": True},
        aggregate_id="req-1",
        aggregate_type="request",
    )

    assert len(publisher.events) == 1
    assert publisher.events[0].event_name == "shell.test"
